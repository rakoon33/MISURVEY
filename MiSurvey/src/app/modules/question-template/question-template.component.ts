import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription, filter, map, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '@coreui/angular';
import { QuestionTemplate } from '../../core/models';
import { questionTemplateActions } from 'src/app/core/store/actions';
import { questionTemplateSelectors } from 'src/app/core/store/selectors';
import { QuestionTemplateService } from 'src/app/core/services';
import {
  ActivatedRoute,
  NavigationStart,
  Router,
  Event as RouterEvent,
} from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-question-template',
  templateUrl: './question-template.component.html',
  styleUrls: ['./question-template.component.scss'],
})
export class QuestionTemplateManagementComponent implements OnInit {
  questionTemplates$: Observable<QuestionTemplate[]>;
  isLoading$: Observable<boolean>;

  selectedTemplateId: number = 0;

  questionTemplateForm: FormGroup;
  editTemplateForm: FormGroup;
  private subscriptions: Subscription = new Subscription();

  filteredTemplates$: Observable<QuestionTemplate[]> | undefined;
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalTemplates: number = 0;
  filterType = 'text';
  pages: number[] = [];
  
  viewTemplateData: any = {};
  
  surveyTypes = [
    { SurveyTypeID: 1, SurveyTypeName: 'Stars' },
    { SurveyTypeID: 2, SurveyTypeName: 'Thumbs' },
    { SurveyTypeID: 3, SurveyTypeName: 'Emoticons' },
    { SurveyTypeID: 4, SurveyTypeName: 'Text' },
    { SurveyTypeID: 5, SurveyTypeName: 'NPS' },
    { SurveyTypeID: 6, SurveyTypeName: 'CSAT' },
  ];

  constructor(
    private store: Store,
    private toastr: ToastrService,
    private modalService: ModalService,
    private router: Router,
    private route: ActivatedRoute,
    private questionTemplateService: QuestionTemplateService
  ) {
    this.questionTemplates$ = this.store.select(
      questionTemplateSelectors.selectAllQuestionTemplates
    );
    this.isLoading$ = this.store.select(
      questionTemplateSelectors.selectQuestionTemplatesLoading
    );
    this.questionTemplateForm = new FormGroup({
      TemplateCategory: new FormControl('', [Validators.required]),
      TemplateText: new FormControl('',[Validators.required]),
      SurveyTypeID: new FormControl('', [Validators.required]),
    });

    this.editTemplateForm = new FormGroup({
      TemplateCategory: new FormControl('', [Validators.required]),
      TemplateText: new FormControl('', [Validators.required]),
      SurveyTypeID: new FormControl('', [Validators.required]),
      CreatedAt: new FormControl({value: '', disabled: true}),
      CreatedBy: new FormControl({value: '', disabled: true}),
      UpdatedAt: new FormControl({value: '', disabled: true}),
      UpdatedBy: new FormControl({value: '', disabled: true})
    });
  }

  ngOnInit() {
      this.loadQuestionTemplates();
  }

  loadQuestionTemplates() {
    this.store.dispatch(
      questionTemplateActions.loadQuestionTemplatesRequest()
    );
    this.applyFilters();
  }

  setFilterType(type: string) {
    this.filterType = type;
    this.applyFilters();
  }
  
  applyFilters() {
    this.filteredTemplates$ = this.questionTemplates$.pipe(
      map(templates =>
        templates.filter(template => {
          let matchesFilter = true;
          const searchLower = this.searchText.toLowerCase();
  
          switch (this.filterType) {
            case 'text':
              matchesFilter = template.TemplateText.toLowerCase().includes(searchLower);
              break;
            case 'category':
              matchesFilter = template.TemplateCategory.toLowerCase().includes(searchLower);
              break;
            case 'surveyType':
              matchesFilter = template.SurveyType.SurveyTypeName.toLowerCase().includes(searchLower);
              break;
            default:
              matchesFilter = true;
          }
  
          return matchesFilter;
        }),
      ),
      tap(filtered => {
        this.totalTemplates = filtered.length;
        this.updatePagination();
      }),
      map(filtered => {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return filtered.slice(startIndex, startIndex + this.itemsPerPage);
      })
    );
  }
  
  refreshData() {
    this.searchText = '';
    this.applyFilters();
  }


  setPage(page: number): void {
    if (page < 1 || page > this.pages.length) {
      return;
    }
    this.currentPage = page;
    this.applyFilters();
  }

  updatePagination() {
    const pageCount = Math.ceil(this.totalTemplates / this.itemsPerPage);
    this.pages = Array.from({ length: pageCount }, (_, i) => i + 1);
    this.applyFilters();
  }
  
  deleteQuestionTemplate() {
    this.store.dispatch(
      questionTemplateActions.deleteQuestionTemplateRequest({ templateId: this.selectedTemplateId })
    );
    this.loadQuestionTemplates();
    this.modalService.toggle({ show: false, id: 'deleteQuestionModal' });
  }

  openCreateQuestionModal() {
    this.modalService.toggle({ show: true, id: 'addQuestionModal' });
  }

  openEditModal(templateId: number) {
    this.selectedTemplateId = templateId;
    this.questionTemplateService.getQuestionTemplateById(templateId).subscribe({
      next: (response) => {
        this.editTemplateForm.setValue({
          TemplateCategory: response.TemplateCategory,
          TemplateText: response.TemplateText,
          SurveyTypeID: response.SurveyTypeID,
          CreatedAt: response.CreatedAt,
          CreatedBy: response.CreatedBy,
          UpdatedAt: response.UpdatedAt || 'N/A',
          UpdatedBy: response.UpdatedBy || 'N/A'
        });
        this.modalService.toggle({ show: true, id: 'editTemplateModal' });
      },
      error: () => {
        this.toastr.error('Failed to load template details.');
      }
    });
  }

  saveTemplateChanges() {
    if (this.editTemplateForm.valid) {
      const updatedTemplate = this.editTemplateForm.value;
      console.log(updatedTemplate);
      updatedTemplate.TemplateID = this.selectedTemplateId;
      this.store.dispatch(questionTemplateActions.updateQuestionTemplateRequest({ templateId: this.selectedTemplateId, templateData: updatedTemplate }));
      this.loadQuestionTemplates() 
      this.modalService.toggle({ show: false, id: 'editTemplateModal' });
    } else {
      this.toastr.error('Form is invalid. Please check and try again.');
    }
  }
  

  openDeleteQuestionTemplate(templateId: number) {
    this.selectedTemplateId = templateId;
    this.modalService.toggle({ show: true, id: 'deleteQuestionModal' });
  }

  openViewModal(templateId: number) {
    this.questionTemplateService.getQuestionTemplateById(templateId).subscribe({
      next: (response) => {
        this.viewTemplateData = response;
        this.modalService.toggle({ show: true, id: 'viewTemplateModal' });
      },
      error: () => {
        this.toastr.error('Failed to load template details.');
      }
    });
  }

  createQuestionTemplate() {
    if (this.questionTemplateForm.valid) {
      
      const templateData = this.questionTemplateForm.value;
      
      console.log(templateData);
      // Here, instead of directly dispatching the action, you could call the service
      this.questionTemplateService.createQuestionTemplate(templateData).subscribe({
        next: (response) => {
          if (response.status) {
            this.toastr.success('Template created successfully');
            this.questionTemplateForm.reset();
            this.modalService.toggle({ show: false, id: 'addQuestionModal' });
            this.loadQuestionTemplates();
          } else {
            // Handle the case where response.status is false
            this.toastr.error('Template creation failed: ' + response.message);
          }
        },
        error: (error) => {
          // Handle the error case
          this.toastr.error('An error occurred while creating the template: ' + error.message);
        }
      });
    } else {
      this.toastr.error('Please fill all required fields.');
    }
  }
  
  exportToPdf() {
    this.questionTemplates$.pipe(take(1)).subscribe((templates) => {
      if (templates.length > 0) {
        const documentDefinition = this.getDocumentDefinition(templates);
        pdfMake.createPdf(documentDefinition).download('question-templates-report.pdf');
      } else {
        this.toastr.error('No question templates data available to export.');
      }
    });
  }

  getDocumentDefinition(templates: QuestionTemplate[]) {
    const now = new Date();
    const formattedTime = now.toLocaleString();

    return {
      content: [
        {
          text: 'Question Templates Report',
          style: 'header',
        },
        this.buildQuestionTemplateTable(templates),
        {
          text: `Report generated on: ${formattedTime}`,
          style: 'subheader',
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10] as [number, number, number, number],
        },
        subheader: {
          fontSize: 10,
          bold: true,
          margin: [0, 10, 0, 10] as [number, number, number, number],
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',
        },
      },
    };
  }

  buildQuestionTemplateTable(templates: QuestionTemplate[]) {
    return {
      table: {
        headerRows: 1,
        widths: [30, '*', '*', '*'],
        body: [
          [
            { text: '#', style: 'tableHeader' },
            { text: 'Category', style: 'tableHeader' },
            { text: 'Text', style: 'tableHeader' },
            { text: 'Survey Type', style: 'tableHeader' }
          ],
          ...templates.map((template, index) => [
            (index + 1).toString(),
            template.TemplateCategory || '',
            template.TemplateText || '',
            template.SurveyType.SurveyTypeName || ''
          ]),
        ],
      },
      layout: 'auto',
    };
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}

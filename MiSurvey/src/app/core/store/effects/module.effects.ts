import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ModuleService } from '../../services/module.service';
import { moduleActions } from '../actions';

@Injectable()
export class ModuleEffects {
  loadModules$ = createEffect(() =>
    this.actions$.pipe(
      ofType(moduleActions.loadModulesRequest),
      switchMap(() =>
        this.moduleService.getAllModules().pipe(
          map((response) =>
            moduleActions.loadModulesSuccess({ modules: response.modules })
          ),
          catchError((error) => of(moduleActions.loadModulesFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private moduleService: ModuleService
  ) {}
}

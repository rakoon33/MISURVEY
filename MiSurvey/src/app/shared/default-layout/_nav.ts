import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    title: true,
    name: 'Management'
  },
  {
    name: 'User Management',
    url: '/user-management',
    iconComponent: { name: 'cil-user' }
  },
  {
    name: 'Company Management',
    url: '/company-management',
    iconComponent: { name: 'cil-building' }
  },
  {
    name: 'Role Management',
    url: '/company-role-management',
    iconComponent: { name: 'cil-contact' }
  },
  {
    name: 'Survey Management',
    url: '/survey-management',
    iconComponent: { name: 'cil-spreadsheet' }
  },
  {
    name: 'Report Management',
    url: '/survey-report',
    iconComponent: { name: 'cilChartPie' }
  },
  {
    name: 'Question Management',
    url: '/question-template',
    iconComponent: { name: 'cilBriefcase' }
  },
  {
    name: 'Customer Management',
    url: '/customer-management',
    iconComponent: { name: 'cilHandshake' }
  },
  {
    name: 'Subscription Plans',
    url: '/subscription-plans',
    iconComponent: { name: 'cibCcMastercard' }
  },
  {
    name: 'User Activity',
    url: '/user-activity',
    iconComponent: { name: 'cilFolder' }
  },
  {
    title: true,
    name: 'Links',
    class: 'py-0'
  },
  {
    name: 'FQA',
    url: 'http://localhost:3000/api-docs',
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank', class: '-text-dark' },
    class: 'mt-auto'
  }
];

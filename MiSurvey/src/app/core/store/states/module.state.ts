import { Module } from '../../models';

export default interface ModuleState {
  modules: Module[];
  loading: boolean;
  error: any;
}

import { AuthEffects } from './store/effects/auth.effects';
import {authReducer} from './store/reducers/auth.reducer';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    StoreModule.forFeature('feature_auth', authReducer),
    EffectsModule.forFeature([AuthEffects])
  ]
})
export class CoreModule {}
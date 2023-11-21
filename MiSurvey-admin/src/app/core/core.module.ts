import { userReducer } from './store/reducers';
import { UserEffects } from './store/effects';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    StoreModule.forFeature('feature_user', userReducer),
    EffectsModule.forFeature([UserEffects])
  ]
})
export class CoreModule {}
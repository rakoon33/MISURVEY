import { AuthEffects, UserEffects} from './store/effects';
import {authReducer, userReducer} from './store/reducers';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {metaReducers} from './store/storage-sync.reducer'
@NgModule({
  imports: [
    StoreModule.forFeature('feature_auth', authReducer),
    StoreModule.forFeature('feature_user', userReducer),
    EffectsModule.forFeature([AuthEffects,UserEffects ])
  ]
})
export class CoreModule {}
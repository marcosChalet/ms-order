import { Module } from '@nestjs/common';
import { featureModule } from './modules';
import { globalModules } from './modules/global';

@Module({
  imports: [...globalModules, ...featureModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

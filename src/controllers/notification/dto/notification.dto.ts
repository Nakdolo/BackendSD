import { IsNotEmpty, IsString } from 'class-validator';

export class NotificationDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsString()
  @IsNotEmpty()
  from!: string;

  @IsString()
  @IsNotEmpty()
  to!: string;

  marked!: boolean;
}

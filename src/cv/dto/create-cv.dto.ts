import {
    IsArray,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class CreateCvDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @IsNotEmpty()
    firstname: string;
  
    @IsInt()
    age: number;
  
    @IsString()
    cin: string;
  
    @IsString()
    job: string;
  
    @IsString()
    @IsOptional()
    path: string;
  
    @IsArray()
    @IsOptional()
    skills: number[]; // Liste des IDs des compétences
  
    @IsInt()
    @IsNotEmpty()
    userId: number; // ID de l'utilisateur associé au CV
  }
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { Cv } from './entities/cv.entity';
import { User } from '../user/entities/user.entity';
import { Skill } from '../skill/entities/skill.entity';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}

  async create(createCvDto: CreateCvDto): Promise<Cv> {
    const { skills, userId, ...cvData } = createCvDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const cv = this.cvRepository.create({ ...cvData, user });
    if (skills && skills.length > 0) {
      const skillEntities = await this.skillRepository.find({
        where: { id: In(skills) },
      });
      cv.skills = skillEntities;
    }
    return this.cvRepository.save(cv);
  }

  async findAll(): Promise<Cv[]> {
    return this.cvRepository.find({ relations: ['user', 'skills'] });
  }

  async findOne(id: number): Promise<Cv> {
    const cv = await this.cvRepository.findOne({
      where: { id },
      relations: ['user', 'skills'],
    });
    if (!cv) {
      throw new NotFoundException(`CV with ID ${id} not found`);
    }
    return cv;
  }

  async update(id: number, updateCvDto: UpdateCvDto): Promise<Cv> {
    const { skills, ...cvData } = updateCvDto;
    const cv = await this.cvRepository.findOne({
      where: { id },
      relations: ['skills'],
    });
    if (!cv) {
      throw new NotFoundException(`CV with ID ${id} not found`);
    }

    Object.assign(cv, cvData);
    if (skills && skills.length > 0) {
      const skillEntities = await this.skillRepository.find({
        where: { id: In(skills) },
      });
      cv.skills = skillEntities;
    }

    return this.cvRepository.save(cv);
  }

  async remove(id: number): Promise<void> {
    const cv = await this.cvRepository.findOne({ where: { id } });
    if (!cv) {
      throw new NotFoundException(`CV with ID ${id} not found`);
    }

    await this.cvRepository.remove(cv);
  }
}
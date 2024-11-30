import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';
import { CvService } from '../cv/cv.service';
import { SkillService } from '../skill/skill.service';
import { faker } from '@faker-js/faker';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UserService);
  const cvService = app.get(CvService);
  const skillService = app.get(SkillService);

  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    users.push(user);
  }

  const savedUsers = [];
  for (const user of users) {
    savedUsers.push(await userService.create(user));
  }

  const skills = [];
  for (let i = 0; i < 5; i++) {
    const skill = {
      designation: faker.word.noun(),
    };
    skills.push(skill);
  }

  const savedSkills = [];
  for (const skill of skills) {
    savedSkills.push(await skillService.create(skill));
  }

  const cvs = [];
  for (let i = 0; i < 10; i++) {
    const cv = {
      name: faker.person.firstName(),
      firstname: faker.person.lastName(),
      age: Math.floor(Math.random() * (60 - 18 + 1)) + 18,
      cin: Math.random().toString().slice(2, 10),
      job: faker.person.jobTitle(),
      path: faker.system.filePath(),
    };
    cvs.push(cv);
  }

  const savedCvs = [];
  for (const cv of cvs) {
    const userId = savedUsers[Math.floor(Math.random() * savedUsers.length)].id;
    const skillIds = savedSkills
      .slice(0, Math.floor(Math.random() * savedSkills.length))
      .map((skill) => skill.id);

    const cvData = { ...cv, userId, skills: skillIds };
    savedCvs.push(await cvService.create(cvData));
  }

  console.log('Database seeded successfully!');
  await app.close();
}

bootstrap();
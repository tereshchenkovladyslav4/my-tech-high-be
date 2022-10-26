import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateRequireSchedule1666781787642 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM email_templates WHERE category_id = 4`);
    await queryRunner.query(
      `insert into \`email_category\` (\`category_id\`, \`category_name\`) values (4, 'Schedules')`,
    );

    await queryRunner.query(`insert  into \`email_templates\`(\`category_id\`,\`title\`,\`subject\`,\`from\`,\`bcc\`,\`body\`,\`template_name\`,\`standard_responses\`,\`template\`,\`inserts\`,\`region_id\`) values 
        (4,'Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Accepted','','standard','parent,student,year',1),
        (4,'Updates Required','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Updates Required','','standard_modal','parent,student,year',1),
        (4,'Updates Allowed','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Updates Allowed','','standard','parent,student,year',1),
        (4,'2nd Semester Unlocked','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','2nd Semester Unlocked','','standard','user',1),
        (4,'2nd Semester Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','2nd Semester Accepted','','standard','user',1),
        (4,'Schedules Page','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedules Page','','standard','parent,student,year',1),

        (4,'Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Accepted','','standard','parent,student,year',2),
        (4,'Updates Required','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Updates Required','','standard_modal','parent,student,year',2),
        (4,'Updates Allowed','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Updates Allowed','','standard','parent,student,year',2),
        (4,'2nd Semester Unlocked','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','2nd Semester Unlocked','','standard','user',2),
        (4,'2nd Semester Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','2nd Semester Accepted','','standard','user',2),
        (4,'Schedules Page','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedules Page','','standard','parent,student,year',2),

        (4,'Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Accepted','','standard','parent,student,year',3),
        (4,'Updates Required','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Updates Required','','standard_modal','parent,student,year',3),
        (4,'Updates Allowed','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Updates Allowed','','standard','parent,student,year',3),
        (4,'2nd Semester Unlocked','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','2nd Semester Unlocked','','standard','user',3),
        (4,'2nd Semester Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','2nd Semester Accepted','','standard','user',3),
        (4,'Schedules Page','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedules Page','','standard','parent,student,year',3),
        
        (4,'Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Accepted','','standard','parent,student,year',4),
        (4,'Updates Required','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Updates Required','','standard_modal','parent,student,year',4),
        (4,'Updates Allowed','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Updates Allowed','','standard','parent,student,year',4),
        (4,'2nd Semester Unlocked','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','2nd Semester Unlocked','','standard','user',4),
        (4,'2nd Semester Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','2nd Semester Accepted','','standard','user',4),
        (4,'Schedules Page','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedules Page','','standard','parent,student,year',4),
        
        (4,'Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Accepted','','standard','parent,student,year',5),
        (4,'Updates Required','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Updates Required','','standard_modal','parent,student,year',5),
        (4,'Updates Allowed','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Updates Allowed','','standard','parent,student,year',5),
        (4,'2nd Semester Unlocked','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','2nd Semester Unlocked','','standard','user',5),
        (4,'2nd Semester Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','2nd Semester Accepted','','standard','user',5),
        (4,'Schedules Page','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedules Page','','standard','parent,student,year',5),
        
        (4,'Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Accepted','','standard','parent,student,year',6),
        (4,'Updates Required','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Updates Required','','standard_modal','parent,student,year',6),
        (4,'Updates Allowed','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Updates Allowed','','standard','parent,student,year',6),
        (4,'2nd Semester Unlocked','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','2nd Semester Unlocked','','standard','user',6),
        (4,'2nd Semester Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','2nd Semester Accepted','','standard','user',6),
        (4,'Schedules Page','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedules Page','','standard','parent,student,year',6),
        
        (4,'Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Accepted','','standard','parent,student,year',7),
        (4,'Updates Required','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Updates Required','','standard_modal','parent,student,year',7),
        (4,'Updates Allowed','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Updates Allowed','','standard','parent,student,year',7),
        (4,'2nd Semester Unlocked','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','2nd Semester Unlocked','','standard','user',7),
        (4,'2nd Semester Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','2nd Semester Accepted','','standard','user',7),
        (4,'Schedules Page','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedules Page','','standard','parent,student,year',7),
        
        (4,'Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Accepted','','standard','parent,student,year',8),
        (4,'Updates Required','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Updates Required','','standard_modal','parent,student,year',8),
        (4,'Updates Allowed','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Updates Allowed','','standard','parent,student,year',8),
        (4,'2nd Semester Unlocked','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','2nd Semester Unlocked','','standard','user',8),
        (4,'2nd Semester Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','2nd Semester Accepted','','standard','user',8),
        (4,'Schedules Page','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedules Page','','standard','parent,student,year',8),
        
        (4,'Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Accepted','','standard','parent,student,year',9),
        (4,'Updates Required','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Updates Required','','standard_modal','parent,student,year',9),
        (4,'Updates Allowed','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Updates Allowed','','standard','parent,student,year',9),
        (4,'2nd Semester Unlocked','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','2nd Semester Unlocked','','standard','user',9),
        (4,'2nd Semester Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','2nd Semester Accepted','','standard','user',9),
        (4,'Schedules Page','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedules Page','','standard','parent,student,year',9);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM email_templates WHERE category_id = 4`);
    await queryRunner.query(`DELETE FROM email_category_id WHERE category_id = 4`);
  }
}

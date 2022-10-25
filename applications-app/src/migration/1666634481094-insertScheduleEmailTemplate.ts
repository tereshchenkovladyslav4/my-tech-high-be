import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertScheduleEmailTemplate1666634481094 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`insert  into \`email_templates\`(\`category_id\`,\`title\`,\`subject\`,\`from\`,\`bcc\`,\`body\`,\`template_name\`,\`standard_responses\`,\`template\`,\`inserts\`,\`region_id\`) values 
        (4,'Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',1),
        (4,'Updates Required','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',1),
        (4,'Updates Allowed','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',1),
        (4,'2nd Semester Unlocked','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',1),
        (4,'2nd Semester Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',1),
        (4,'Schedules Page','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',1),
        (4,'Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',2),
        (4,'Updates Required','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',2),
        (4,'Updates Allowed','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',2),
        (4,'2nd Semester Unlocked','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',2),
        (4,'2nd Semester Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',2),
        (4,'Schedules Page','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',2),
        (4,'Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',3),
        (4,'Updates Required','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',3),
        (4,'Updates Allowed','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',3),
        (4,'2nd Semester Unlocked','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',3),
        (4,'2nd Semester Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',3),
        (4,'Schedules Page','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',3),
        
        (4,'Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',4),
        (4,'Updates Required','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',4),
        (4,'Updates Allowed','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',4),
        (4,'2nd Semester Unlocked','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',4),
        (4,'2nd Semester Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',4),
        (4,'Schedules Page','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',4),
        
        (4,'Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',5),
        (4,'Updates Required','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',5),
        (4,'Updates Allowed','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',5),
        (4,'2nd Semester Unlocked','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',5),
        (4,'2nd Semester Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',5),
        (4,'Schedules Page','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',5),
        
        (4,'Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',6),
        (4,'Updates Required','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',6),
        (4,'Updates Allowed','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',6),
        (4,'2nd Semester Unlocked','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',6),
        (4,'2nd Semester Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',6),
        (4,'Schedules Page','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',6),
        
        (4,'Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',7),
        (4,'Updates Required','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',7),
        (4,'Updates Allowed','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',7),
        (4,'2nd Semester Unlocked','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',7),
        (4,'2nd Semester Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',7),
        (4,'Schedules Page','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',7),
        
        (4,'Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',8),
        (4,'Updates Required','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',8),
        (4,'Updates Allowed','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',8),
        (4,'2nd Semester Unlocked','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',8),
        (4,'2nd Semester Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',8),
        (4,'Schedules Page','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',8),
        
        (4,'Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',9),
        (4,'Updates Required','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',9),
        (4,'Updates Allowed','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',9),
        (4,'2nd Semester Unlocked','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',9),
        (4,'2nd Semester Accepted','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',9),
        (4,'Schedules Page','Subject','infocenter+users@mytechhigh.com','infocenter+usersbcc1@mytechhigh.com, faitht@codev.com','<p>Hi</p>','Schedule Accepted','','standard','user',9);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM email_templates WHERE category_id = 4`);
  }
}

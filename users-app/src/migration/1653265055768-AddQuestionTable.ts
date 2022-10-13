import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQuestionTable1653265055768 implements MigrationInterface {
  name = 'AddQuestionTable1653265055768';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`mth_question\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`region_id\` int NOT NULL,
            \`section\` VARCHAR(40) NOT NULL COMMENT 'quick-link',
            \`type\` int NOT NULL COMMENT '0 => DropDown,  1 => Text Field,  2 => Check Box,  3 => Agreement, 4 => Multiple Choices, 5 => Calendar, 6 => Information, 7 => Upload',
            \`sequence\` int NOT NULL,
            \`question\` varchar(255) DEFAULT NULL,
            \`options\` text COMMENT '[{label, value, additional_question_id}]',
            \`slug\` VARCHAR(255) DEFAULT NULL,
            \`validation\` TINYINT(2) NOT NULL DEFAULT 0 COMMENT '0 => None, 1 => Numbers, 2 => Email',
            \`main_question\` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Shows if this question is from System or not, 0 => Admin created, 1 => Comes from system prototype',
            \`default_question\` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '0 => Custom Question, 1 => Default Question',
            \`additional_question\` TINYINT(2) NOT NULL DEFAULT 0 COMMENT '0 => None, -1 => Additional Question for other, > 0 => Additional Question ID',
            \`required\` tinyint(1) DEFAULT NULL COMMENT '0 => Not Required,  1 => Required',
            PRIMARY KEY (\`id\`) USING BTREE
          ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`mth_question\``);
  }
}

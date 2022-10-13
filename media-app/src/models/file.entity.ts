import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('mth_file')
export class File extends BaseEntity {
  @Column()
  @PrimaryGeneratedColumn()
  file_id?: number;

  @Column()
  name?: string;

  @Column()
  type?: string;

  @Column()
  item1?: string;

  @Column()
  item2?: string;

  @Column()
  item3?: string;

  @Column()
  year?: number;

  @Column()
  is_new_upload_type?: number;

  @Column()
  uploaded_by?: number;
}

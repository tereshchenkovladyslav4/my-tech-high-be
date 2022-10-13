import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'core_users' })
export class User extends BaseEntity {
  @Column()
  @PrimaryGeneratedColumn()
  user_id?: number;

  @Column()
  email?: string;

  @Column()
  password?: string;

  @Column()
  firstName?: string;

  @Column()
  lastName?: string;

  @Column()
  level?: number;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column()
  avatarUrl?: string;
}

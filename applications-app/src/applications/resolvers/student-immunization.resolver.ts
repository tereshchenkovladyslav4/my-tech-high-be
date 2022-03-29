import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StudentImmunizationInput } from '../dto/student-immunization.input';
import { StudentImmunization } from '../models/student-immunization.entity';
import { ImmunizationSettingsService } from '../services/immunization-settings.service';
import { StudentImmunizationService } from '../services/student-immunization.service';

@Resolver((of) => StudentImmunization)
export class StudentImmunizationResolver {
  constructor(private studentImmunizationService: StudentImmunizationService,
    private immunizationSettingsService: ImmunizationSettingsService

  ) { }
  @Query((returns) => StudentImmunization, { nullable: true })
  async StudentImmunization(
    @Args('student_id', { type: () => Int }) student_id: number,
    @Args('immunization_id', { type: () => Int }) immunization_id: number,
  ) {
    return this.studentImmunizationService.findOne(student_id, immunization_id);
  }
  @Query((returns) => [StudentImmunization],)
  async StudentImmunizations(
    @Args('student_id', { type: () => Int }) student_id: number,
  ) {
    const [studentImmunizations, immunizations] = await Promise.all([
      this.studentImmunizationService.findAll(student_id),
      this.immunizationSettingsService.findAll({ is_enabled: true }),
    ])
    let res: StudentImmunization[] = []
    for (const imm of immunizations.results) {
      let sIm = studentImmunizations.find((v) => v.immunization_id === imm.id)
      if (!sIm) {
        sIm = {
          student_id: student_id,
          immunization_id: imm.id,
          immunization: imm,
        }
      } else {
        sIm.immunization = imm
      }
      res.push(sIm)
    }
    return res
  }

  @Mutation((returns) => Boolean, {
    name: 'updateCreateStudentImmunization',
  })
  async updateCreateStudentImmunization(
    @Args('data', { type: () => [StudentImmunizationInput] })
    data: StudentImmunizationInput[],
  ): Promise<boolean> {
    return this.studentImmunizationService.createUpdate(data);
  }
}

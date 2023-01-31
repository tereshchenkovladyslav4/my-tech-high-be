import { DiplomaSeekingPathStatus } from '../enums';

export const convertDiplomaSeeking = (
  diplomaAnswer: number | null | undefined,
): DiplomaSeekingPathStatus | undefined => {
  switch (diplomaAnswer) {
    case 0:
      return DiplomaSeekingPathStatus.NON_DIPLOMA_SEEKING;
    case 1:
      return DiplomaSeekingPathStatus.DIPLOMA_SEEKING;
    case null:
      return DiplomaSeekingPathStatus.BOTH;
    default:
      return undefined;
  }
};

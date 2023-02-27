import { ResourceSubtitle } from '../enums';
import { ResourceRequest } from '../models/resource-request.entity';

export const resourceRequestCost = (data: ResourceRequest): string => {
  const subtitle = data?.Resource?.subtitle;
  const price = data?.Resource?.price;
  return subtitle == ResourceSubtitle.PRICE
    ? `$${+price}`
    : subtitle == ResourceSubtitle.INCLUDED
    ? 'Included'
    : 'Free';
};

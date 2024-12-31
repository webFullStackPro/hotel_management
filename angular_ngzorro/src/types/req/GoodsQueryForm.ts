export class GoodsQueryForm {
  name?: string;

  constructor(values: Partial<GoodsQueryForm>) {
    Object.assign(this, values);
  }
}

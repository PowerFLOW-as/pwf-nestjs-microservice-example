import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TestDocument = Test;

@Schema()
export class Test {
  @Prop()
  name: string;

  @Prop()
  count: number;
}

export const TestSchema = SchemaFactory.createForClass(Test);

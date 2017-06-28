/** @flow */
import { loadConsumer } from '../../../consumer';
import Component from '../../../consumer/component';
import { BitId } from '../../../bit-id';
import BitMap from '../../../consumer/bit-map';

/**
 * Creates a new component, writes it to the file system and adds to bit.map
 */
export default async function create(
  idRaw: string,
  withSpecs: boolean = false,
  withBitJson: boolean = false,
  force: boolean = false
  ): Promise<Component> {
  const consumer = await loadConsumer();
  const id = BitId.parse(idRaw);
  const bitPath = consumer.composeBitPath(id);
  const component = Component.create({
    name: id.name,
    box: id.box,
    withSpecs,
    consumerBitJson: consumer.bitJson,
  }, consumer.scope);
  await component.write(bitPath, withBitJson, force);
  const bitMap = await BitMap.load(consumer.getPath());
  bitMap.addComponent(id.toString(), [consumer.composeRelativeBitPath(id)]);
  await bitMap.write();
  await consumer.driver.runHook('onCreate', component);
  return component;
}

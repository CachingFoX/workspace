import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { gcCodeToId, tbCodeToId } from '../../src/utils.js'

describe('gcCodeToId', () => {
  it('zeigt den initialen count', () => {
    const id = gcCodeToId("GC1")
    expect(id).equal(1);
  })

  it('Jump from Base16 to Base31', async () => {
    // last code with Base16
    expect(gcCodeToId("GCFFFF")).equal(65535);
    // first code with Base31
    expect(gcCodeToId("GCG000")).equal(65536);
  })

  it('Jump from Base16 to Base31', async () => {
    // last code with Base16
    expect(tbCodeToId("TB1Y84G")).equal(1384168);
    // first code with Base31
    expect(tbCodeToId("TBB7R8Z")).equal(9979490);
    expect(tbCodeToId("TBB8EKJ")).equal(1000000);
  })
})

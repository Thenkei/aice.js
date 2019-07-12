const chai = require('chai');

const { expect } = chai;

const { DoubleLinkedList } = require('../src/streamTransformers/');

describe('DoubleLinkedList', () => {
  it('Get(-1) from empty DoubleLinkedList', () => {
    const list = new DoubleLinkedList();

    const node = list.get(-1);
    expect(node).to.equal(undefined);
  });

  it('Get(0) from empty DoubleLinkedList', () => {
    const list = new DoubleLinkedList();

    const node = list.get(0);
    expect(node).to.equal(undefined);
  });

  it('One item added to DoubleLinkedList', () => {
    const list = new DoubleLinkedList();
    list.append({ text: 'Hello' });

    let node = list.get();
    expect(node.value.text).to.equal('Hello');
    node = list.next;
    expect(node).to.equal(undefined);
  });

  it('One string item added to DoubleLinkedList', () => {
    const list = new DoubleLinkedList();
    list.append('Hello');

    let node = list.get();
    expect(node.value).to.equal('Hello');
    node = list.next;
    expect(node).to.equal(undefined);
  });
});

describe('DoubleLinkedList Iterator', () => {
  it('Iterate using next on empty list', () => {
    const list = new DoubleLinkedList();
    const it = list.values();
    let next = it.next();
    next = it.next();
    expect(next.value).to.equal(undefined);
  });

  it('One item added and iterate using next', () => {
    const list = new DoubleLinkedList();
    list.append({ text: 'Hello' });
    const it = list.values();
    let next = it.next();
    expect(next.value.text).to.equal('Hello');
    next = it.next();
    expect(next.value).to.equal(undefined);
  });

  it('One item added and iterate using next 2', () => {
    const list = new DoubleLinkedList();
    list.append({ text: 'Hello' });
    const it = list.lists();
    let next = it.next();
    expect(next.value.value.text).to.equal('Hello');
    next = it.next();
    expect(next.value).to.equal(undefined);
  });

  it('Array string items added iterate using for ... of', () => {
    const list = new DoubleLinkedList();
    ['var1', 'var2', 'var3'].forEach(e => list.append(e));
    let i = 1;
    for (const it of list) {
      expect(it.value).to.equal(`var${i}`);
      i += 1;
    }
  });

  it('Array string items added iterate using for ... of destructuring', () => {
    const list = new DoubleLinkedList();
    ['var1', 'var2', 'var3'].forEach(e => list.append(e));
    let i = 1;
    for (const { value } of list) {
      expect(value).to.equal(`var${i}`);
      i += 1;
    }
  });

  it('Array convertion', () => {
    const list = new DoubleLinkedList();
    list.append('red');
    list.append('orange');
    list.append('green');
    list.append('yellow');

    expect([...list.values()]).to.eql(['red', 'orange', 'green', 'yellow']);
  });

  it('String convertion', () => {
    const list = new DoubleLinkedList();
    list.append('red');
    list.append('orange');
    list.append('green');
    list.append('yellow');

    expect(...list.values()).to.equal('red');
    // TODO ... stream gestion
  });
});

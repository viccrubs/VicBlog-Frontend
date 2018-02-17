import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from 'chai';
import { LocaleStore } from "../src/app/stores";
import { en, cn } from "../src/app/internationalization";
import { ComponentChildrenType } from "../src/app/stores/LocaleStore";
import * as React from 'react';

@suite class LocaleStoreFormatTest {
  private store: LocaleStore = new LocaleStore([en, cn],en.id,en.id);
  @test formatOnlyString() {
    const format = "123{name}456";
    const replacements = { name: "156"};
    const result = this.store.get(format, replacements);
    expect(result).eq("123156456");
  }

  @test formatStringWithElement() {
    const format = "123{element}456{text}";
    const replacements = { element: <a/>,text: "156"};
    const result = this.store.get(format, replacements);
    expect(result).deep.eq(["123",<a key={1}/>,"456","156",""]);
  }

  @test formatMultipleElementsWithRepeatedTag() {
    const format = "123{e1}456{e2}789{e1}";
    const replacements = { e1: <a/>,e2: <span/>};
    const result = this.store.get(format, replacements);
    expect(result).deep.eq(["123",<a key={1}/>,"456",<span key={3}/>,"789",<a key={5}/>,""]);
  }


}
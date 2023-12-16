import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { OrderedListComponent } from './ordered-list.component';
import { By } from '@angular/platform-browser';

describe('OrderedListComponent', () => {
  let component: OrderedListComponent;
  let fixture: ComponentFixture<OrderedListComponent>;

  const addAll = (items: string[]) => {
    const addElem = fixture.debugElement.query(
      By.css('[data-testid="add-item"]')
    );
    expect(addElem).not.toBeNull();
    
    for (const item of items) {
      addElem.nativeElement.value = item;
      addElem.nativeElement.dispatchEvent(new Event("input"));
      expect(addElem.nativeElement.value).toEqual(item);
      addElem.triggerEventHandler("keydown.enter", {});
    }
  };
  
  const validateList = (expected: string[]) => {
    const itemsElem = fixture.debugElement.query(
      By.css('[data-testid="items-list"]')
    );
    const children = itemsElem.nativeElement.querySelectorAll("li");
    expect(children).not.toBeNull();
    expect(children.length).toEqual(expected.length);
      
    for (let i = 0; i < expected.length; i++) {
      expect(children[i].innerHTML).toContain(expected[i]);
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderedListComponent],
      providers: [{ 
        provide: ComponentFixtureAutoDetect, 
        useValue: true 
      }]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("renders correct elements", () => {
    it('should create the component', () => {
      expect(component).toBeDefined();
    });
  
    it("should have an element with the class '.add-item'", () => {
      const addElem = fixture.debugElement.query(By.css('[data-testid="add-item"]'));
      expect(addElem).not.toBeNull();
    });
    
    it("should have an element with the class '.sort-direction'", () => {
      const sortElem = fixture.debugElement.query(
        By.css('[data-testid="sort-direction"]')
      );
      expect(sortElem).not.toBeNull();
    });
    
    it("should have an element with the class '.items-list'", () => {
      const itemsElem = fixture.debugElement.query(
        By.css('[data-testid="items-list"]')
      );
      expect(itemsElem).not.toBeNull();
    });
    
    it("should have an element with the class '.clear-list'", () => {
      const clearElem = fixture.debugElement.query(
        By.css('[data-testid="clear-list"]')
      );
      expect(clearElem).not.toBeNull();
    });
  });

  describe("responds correctly to all input behaviors", () => {
    it('should allow input on ".add-item"', () => {
      const addElem = fixture.debugElement.query(
        By.css('[data-testid="add-item"]')
      );
      expect(addElem).not.toBeNull();
      addElem.nativeElement.value = "pear";
      addElem.nativeElement.dispatchEvent(new Event("input"));
      fixture.detectChanges();
      expect(addElem.nativeElement.value).toEqual("pear");
    });
    
    it('should reject empty input on ".add-item"', fakeAsync(() => {
      const addElem = fixture.debugElement.query(
        By.css('[data-testid="add-item"]')
      );
      expect(addElem).not.toBeNull();
      addElem.nativeElement.value = "";
      addElem.nativeElement.dispatchEvent(new Event("input"));
      expect(addElem.nativeElement.value).toEqual("");
      addElem.triggerEventHandler("keydown.enter", {});
      fixture.detectChanges();
      tick();
      const itemsElem = fixture.debugElement.query(
        By.css('[data-testid="items-list"]')
      );
      const children = itemsElem.nativeElement.querySelectorAll("li");
      expect(children.length).toEqual(0);
    }));
    
    it('should add an item when the Enter key is pressed on ".add-item"', fakeAsync(() => {
      addAll(["pear"]);
      fixture.detectChanges();
      tick();
      validateList(["pear"]);
    }));
    
    it('should add a second item that comes before the first alphabetically', fakeAsync(() => {
      addAll(["pear", "banana"]);
      fixture.detectChanges();
      tick();
      validateList(["banana", "pear"]);
    }));
    
    it('should add a third item that comes between the existing items', fakeAsync(() => {
      addAll(["pear", "banana", "peach"]);
      fixture.detectChanges();
      tick();
      validateList(["banana", "peach", "pear"]);
    }));
    
    it('should add a third item that comes between the existing items', fakeAsync(() => {
      addAll(["pear", "banana", "peach", "watermelon"]);
      fixture.detectChanges();
      tick();
      validateList(["banana", "peach", "pear", "watermelon"]);
    }));
  });

  describe("responds to changes in the sort direction", () => {
    it('should reverse all of the items currently in the list', fakeAsync(() => {
      addAll(["pear", "banana", "peach", "watermelon"]);
      fixture.detectChanges();
      tick();
      const dirElem = fixture.debugElement.query(
        By.css('[data-testid="sort-direction"]')
      );
      expect(dirElem).not.toBeNull();
      dirElem.nativeElement.click();
      validateList(["watermelon", "pear", "peach", "banana"]);
    }));
    
    it('should show a different button string when ordered descending', fakeAsync(() => {
      addAll(["pear", "banana", "peach", "watermelon"]);
      fixture.detectChanges();
      tick();
      const dirElem = fixture.debugElement.query(
        By.css('[data-testid="sort-direction"]')
      );
      expect(dirElem).not.toBeNull();
      const beforeText = dirElem.nativeElement.textContent;
      dirElem.nativeElement.click();
      const afterText = dirElem.nativeElement.textContent;
      expect(beforeText).not.toEqual(afterText);
    }));
    
    it('should still add items correctly when ordered descending', fakeAsync(() => {
      const dirElem = fixture.debugElement.query(
        By.css('[data-testid="sort-direction"]')
      );
      expect(dirElem).not.toBeNull();
      addAll(["pear", "banana", "peach", "watermelon"]);
      fixture.detectChanges();
      tick();
      dirElem.nativeElement.click();
      addAll(["nectarine"]);
      fixture.detectChanges();
      tick();
      validateList(["watermelon", "pear", "peach", "nectarine", "banana"]);
    }));
    
    it('should reverse all of the items currently in the list back to ascending', fakeAsync(() => {
      addAll(["pear", "banana", "peach", "watermelon", "nectarine"]);
      const dirElem = fixture.debugElement.query(
        By.css('[data-testid="sort-direction"]')
      );
      expect(dirElem).not.toBeNull();
      fixture.detectChanges();
      tick();
      dirElem.nativeElement.click();
      dirElem.nativeElement.click();
      validateList(["banana", "nectarine", "peach", "pear", "watermelon"]);
    }));
    
    it('should still add items correctly when re-ordered ascending', fakeAsync(() => {
      addAll(["pear", "banana", "watermelon", "nectarine"]);
      const clearElem = fixture.debugElement.query(
        By.css('[data-testid="clear-list"]')
      );
      expect(clearElem).not.toBeNull();
      fixture.detectChanges();
      tick();
      clearElem.nativeElement.click();
      fixture.detectChanges();
      tick();
      validateList([]);
    }));
  });

  describe("clear button works", () => {
    it('should clear all of the items currently in the list as well as any value in ".add-item"', fakeAsync(() => {
      const addElem = fixture.debugElement.query(
        By.css('[data-testid="add-item"]')
      );
      const clearElem = fixture.debugElement.query(
        By.css('[data-testid="clear-list"]')
      );
      expect(addElem).not.toBeNull();
      expect(clearElem).not.toBeNull();
      addAll(["pear", "banana", "watermelon", "nectarine"]);
      fixture.detectChanges();
      tick();
      addElem.nativeElement.value = "applesauce";
      addElem.nativeElement.dispatchEvent(new Event("input"));
      fixture.detectChanges();
      expect(addElem.nativeElement.value).toEqual("applesauce");
      clearElem.nativeElement.click();
      fixture.detectChanges();
      tick();
      expect(addElem.nativeElement.value).toEqual("");
      validateList([]);
    }));
  });

});

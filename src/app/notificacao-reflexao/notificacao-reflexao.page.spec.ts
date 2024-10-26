import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificacaoReflexaoPage } from './notificacao-reflexao.page';

describe('NotificacaoReflexaoPage', () => {
  let component: NotificacaoReflexaoPage;
  let fixture: ComponentFixture<NotificacaoReflexaoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacaoReflexaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

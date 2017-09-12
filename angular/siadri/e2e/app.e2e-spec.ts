import { DevsiadriPage } from './app.po';

describe('devsiadri App', () => {
  let page: DevsiadriPage;

  beforeEach(() => {
    page = new DevsiadriPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});

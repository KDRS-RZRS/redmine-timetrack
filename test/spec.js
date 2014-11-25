describe('Redmine-Timetrack Login', function() {
  it('should login', function() {
    browser.get('http://localhost:3000/index.html');

    element(by.model('baseUrl')).sendKeys('http://localhost:3000/redmine/');
    element(by.model('apiKey')).sendKeys('12156156151fdsfds1f5361f56s');
    element(by.buttonText('Login')).click();

    expect(by.cssContainingText('h2', 'New Timeentry')).not.toBeNull();
  });

  /*
  it('should show 2 Projects', function() {
    var todoList = element.all(by.repeater('todo in todos'));
    expect(todoList.count()).toEqual(3);
    expect(todoList.get(2).getText()).toEqual('write a protractor test');
  });
  */
});
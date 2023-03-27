import { TooltipListPipe } from './tooltip-list.pipe';

describe('TooltipListPipe', () => {
  let pipe: TooltipListPipe;

  beforeEach(() => {
    pipe = new TooltipListPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform an array of strings to a list with bullet points', () => {
    const input = ['apple', 'banana', 'cherry'];
    const expectedOutput = '\n• apple\n• banana\n• cherry\n';
    expect(pipe.transform(input)).toEqual(expectedOutput);
  });

  it('should return an empty string if input is undefined', () => {
    const input: string[] = [];
    const expectedOutput = '';
    expect(pipe.transform(input)).toEqual(expectedOutput);
  });
});

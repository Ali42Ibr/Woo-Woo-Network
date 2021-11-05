// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

//  example of test case for empty element 


// <span data-testid="not-empty"><span data-testid="empty"></span></span>
// <span data-testid="with-whitespace"> </span>
// <span data-testid="with-comment"><!-- comment --></span>


// expect(getByTestId('empty')).toBeEmptyDOMElement()
// expect(getByTestId('not-empty')).not.toBeEmptyDOMElement()
// expect(getByTestId('with-whitespace')).not.toBeEmptyDOMElement()
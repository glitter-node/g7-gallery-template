import { default as React } from 'react';
import { default as templateMetadata } from '../template.json';
type BaseProps<T> = T & {
    children?: React.ReactNode;
};
export declare const Div: (props: BaseProps<React.HTMLAttributes<HTMLDivElement>>) => React.DOMElement<React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
}, Element>;
export declare const Article: (props: BaseProps<React.HTMLAttributes<HTMLElement>>) => React.DOMElement<React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
}, Element>;
export declare const Section: (props: BaseProps<React.HTMLAttributes<HTMLElement>>) => React.DOMElement<React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
}, Element>;
export declare const Nav: (props: BaseProps<React.HTMLAttributes<HTMLElement>>) => React.DOMElement<React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
}, Element>;
export declare const A: (props: BaseProps<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => React.DOMElement<React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    children?: React.ReactNode;
}, Element>;
export declare const Span: (props: BaseProps<React.HTMLAttributes<HTMLSpanElement>>) => React.DOMElement<React.HTMLAttributes<HTMLSpanElement> & {
    children?: React.ReactNode;
}, Element>;
export declare const P: (props: BaseProps<React.HTMLAttributes<HTMLParagraphElement>>) => React.DOMElement<React.HTMLAttributes<HTMLParagraphElement> & {
    children?: React.ReactNode;
}, Element>;
export declare const H1: (props: BaseProps<React.HTMLAttributes<HTMLHeadingElement>>) => React.DOMElement<React.HTMLAttributes<HTMLHeadingElement> & {
    children?: React.ReactNode;
}, Element>;
export declare const H2: (props: BaseProps<React.HTMLAttributes<HTMLHeadingElement>>) => React.DOMElement<React.HTMLAttributes<HTMLHeadingElement> & {
    children?: React.ReactNode;
}, Element>;
export declare const H3: (props: BaseProps<React.HTMLAttributes<HTMLHeadingElement>>) => React.DOMElement<React.HTMLAttributes<HTMLHeadingElement> & {
    children?: React.ReactNode;
}, Element>;
export declare const Ul: (props: BaseProps<React.HTMLAttributes<HTMLUListElement>>) => React.DOMElement<React.HTMLAttributes<HTMLUListElement> & {
    children?: React.ReactNode;
}, Element>;
export declare const Li: (props: BaseProps<React.HTMLAttributes<HTMLLIElement>>) => React.DOMElement<React.HTMLAttributes<HTMLLIElement> & {
    children?: React.ReactNode;
}, Element>;
export declare const Img: (props: BaseProps<React.ImgHTMLAttributes<HTMLImageElement>>) => React.DOMElement<React.ImgHTMLAttributes<HTMLImageElement> & {
    children?: React.ReactNode;
}, Element>;
export declare const Form: (props: BaseProps<React.FormHTMLAttributes<HTMLFormElement>>) => React.DOMElement<React.FormHTMLAttributes<HTMLFormElement> & {
    children?: React.ReactNode;
}, Element>;
export declare const Label: (props: BaseProps<React.LabelHTMLAttributes<HTMLLabelElement>>) => React.DOMElement<React.LabelHTMLAttributes<HTMLLabelElement> & {
    children?: React.ReactNode;
}, Element>;
export declare const Input: (props: BaseProps<React.InputHTMLAttributes<HTMLInputElement>>) => React.DOMElement<React.InputHTMLAttributes<HTMLInputElement> & {
    children?: React.ReactNode;
}, Element>;
export declare const Select: (props: BaseProps<React.SelectHTMLAttributes<HTMLSelectElement>>) => React.DOMElement<React.SelectHTMLAttributes<HTMLSelectElement> & {
    children?: React.ReactNode;
}, Element>;
export declare const Option: (props: BaseProps<React.OptionHTMLAttributes<HTMLOptionElement>>) => React.DOMElement<React.OptionHTMLAttributes<HTMLOptionElement> & {
    children?: React.ReactNode;
}, Element>;
export declare const Textarea: (props: BaseProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>>) => React.DOMElement<React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    children?: React.ReactNode;
}, Element>;
export declare const Button: (props: BaseProps<React.ButtonHTMLAttributes<HTMLButtonElement>>) => React.DOMElement<React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
}, Element>;
export { templateMetadata };
export declare function initTemplate(): void;

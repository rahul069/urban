// pdfkit ships no types and no @types/pdfkit package exists for the
// installed major version. This is a minimal shim covering what
// InvoicesService actually uses (fluent .text()/.fontSize()/etc, plus
// .pipe()/.end() from the underlying stream), not a full API surface.
declare module 'pdfkit' {
  class PDFDocument {
    constructor(options?: Record<string, unknown>);
    page: { height: number; width: number };
    pipe(destination: NodeJS.WritableStream): NodeJS.WritableStream;
    end(): void;
    [key: string]: any;
  }
  export = PDFDocument;
}

declare namespace PDFKit {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type PDFDocument = import('pdfkit');
}

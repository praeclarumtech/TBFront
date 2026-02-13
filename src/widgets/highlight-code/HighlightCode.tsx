// import node module libraries
import { Fragment, MouseEvent } from "react";
import { CopyToClipboard as CopyToClipboardOriginal } from "react-copy-to-clipboard";
import SyntaxHighlighterOriginal from "react-syntax-highlighter";
import type { ComponentType } from "react";

const CopyToClipboard = CopyToClipboardOriginal as unknown as ComponentType<any>;
const SyntaxHighlighter = SyntaxHighlighterOriginal as unknown as ComponentType<any>;
import { shadesOfPurple } from "react-syntax-highlighter/dist/esm/styles/hljs";

const HighlightCode = ({ code }: { code: string }) => {
  const copyAction = (event: MouseEvent<HTMLButtonElement>) =>
    (event.currentTarget.innerHTML = "Copied") ||
    setTimeout(() => (event.currentTarget.innerHTML = "Copy"), 300);

  return (
    <Fragment>
      <CopyToClipboard text={code}>
        <button className="copy-button" onClick={(event) => copyAction(event)}>
          Copy
        </button>
      </CopyToClipboard>
      <SyntaxHighlighter
        language="handlebars"
        style={shadesOfPurple}
        className="rounded"
      >
        {code}
      </SyntaxHighlighter>
    </Fragment>
  );
};
export default HighlightCode;

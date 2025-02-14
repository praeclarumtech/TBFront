export const LiveDemoCode = `
const Modals = () => {  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <Fragment>
            <Button variant="primary" onClick={handleShow}>
                Launch demo modal
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}
`.trim();
 


export const ModalsCode = [

  LiveDemoCode,
 
];
 
export default ModalsCode;
 
 
// import node module libraries
import { Fragment, MouseEvent } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import SyntaxHighlighter from "react-syntax-highlighter";
import { shadesOfPurple } from "react-syntax-highlighter/dist/esm/styles/hljs";
interface  MouseEvent<HTMLButtonElement:


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
 
 
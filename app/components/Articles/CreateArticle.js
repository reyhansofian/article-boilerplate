import React from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw
} from 'draft-js';
import { connect } from 'react-redux';
import BlockStyleControls from './BlockStyleControls';
import InlineStyleControls from './InlineStyleControls';
import { stateToHTML } from 'draft-js-export-html';
import { saveArticle } from '../../actions/article';
import Messages from '../Messages';

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}

class CreateArticle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      editorTitle: ''
    };
    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({ editorState });
    this.onChangeTitle = (e) => this.setState({ editorTitle: e.target.value });

    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChange(editorState) {
    this.setState({ editorState });
  }

  handleSubmit(e) {
    e.preventDefault();
    const raw = convertToRaw(this.state.editorState.getCurrentContent());
    const rawHTML = stateToHTML(this.state.editorState.getCurrentContent());
    const editorTitle = this.state.editorTitle;

    this.props.dispatch(saveArticle(editorTitle, raw, rawHTML));
  }

  render() {
    const { editorState } = this.state;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    return (
      <div className="container-fluid">
        <Messages messages={this.props.messages} />
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col-sm-9">
              <input
                className="form-control"
                type="text"
                name="title"
                id="title"
                placeholder="Your title please..."
                onChange={this.onChangeTitle}
              />
            </div>
            <div className="col-sm-3" style={{ paddingTop: '2px' }}>
              <p>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save
                </button>
                <button type="button" className="btn btn-default">Cancel</button>
              </p>
            </div>
          </div>
          <div className="row" style={{ marginTop: '5px' }}>
            <div className="col-sm-12">
              <div className="RichEditor-root">
                <BlockStyleControls
                  editorState={editorState}
                  onToggle={this.toggleBlockType}
                />
                <InlineStyleControls
                  editorState={editorState}
                  onToggle={this.toggleInlineStyle}
                />
                <div className={className} onClick={this.focus}>
                  <Editor
                    name="post"
                    blockStyleFn={getBlockStyle}
                    customStyleMap={styleMap}
                    editorState={editorState}
                    handleKeyCommand={this.handleKeyCommand}
                    onChange={this.onChange}
                    placeholder="Tell a story..."
                    ref="editor"
                    spellCheck
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  _handleKeyCommand(command) {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }
}

export default connect((state) => ({
  messages: state.messages
}))(CreateArticle);

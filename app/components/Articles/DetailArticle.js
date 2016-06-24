import React from 'react';
import { connect } from 'react-redux';
import { getBySlug } from '../../actions/article';

class DetailArticle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: this.props.details
    };
  }

  componentWillMount() {
    this.props.dispatch(getBySlug(this.props.params.slug));
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ detail: nextProps.details });
  }

  render() {
    return (
      <div className="container">
        {this.state.detail !== undefined &&
          <div className="panel">
            <div className="panel-heading">
              <h2>{this.state.detail.title}</h2>
            </div>
            <div className="panel-body" dangerouslySetInnerHTML={{ __html: this.state.detail.posts }} />
            <div className="panel-footer"></div>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const slug = props.params.slug;
  return {
    details: state.articles[Object.keys(state.articles).filter((i) => {
      return state.articles[i].slug === slug;
    })]
  };
};

export default connect(mapStateToProps)(DetailArticle);

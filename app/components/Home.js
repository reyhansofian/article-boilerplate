import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Messages from './Messages';
import { getAll } from '../actions/article';
import moment from 'moment';

class Home extends React.Component {
  static fetchData(store) {
    return store.dispatch(getAll());
  }

  constructor(props) {
    super(props);
    this.onLikeClick = this.onLikeClick.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getAll());
  }

  onLikeClick(e) {
    const currentIcon = e.target.src.split('/').pop();
    e.target.src = (currentIcon === 'like.svg')
                  ? '/icons/heart/svg/favorite.svg'
                  : '/icons/heart/svg/like.svg';
  }

  render() {
    return (
      <div className="container">
        <Messages messages={this.props.messages} />
        <div className="row">
          {Object.keys(this.props.articles).map((article) =>
            <div className="col-sm-6" key={this.props.articles[article].created_at}>
              <div className="content">
                <div className="panel">
                  <div className="panel-heading row" style={{ padding: '20px 10px 10px 30px' }}>
                    <div className="col-sm-2" style={{ paddingRight: '0px', width: '60px' }}>
                      <a href="#" className="navbar-avatar dropdown-toggle">
                        <img
                          style={{
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                          }}
                          src={
                            this.props.articles[article].users.picture
                            || this.props.articles[article].users.gravatar
                          }
                          role="presentation"
                        />
                      </a>
                    </div>
                    <div className="col-sm-10">
                      <p style={{ marginBottom: '0px' }}>
                        <b>
                          {this.props.articles[article].users.name}
                        </b>
                        <span
                          className="text-grey"
                          dangerouslySetInnerHTML={{ __html: '&nbsp;&middot;&nbsp;' }}
                        />
                        <span className="text-grey">
                          {moment(this.props.articles[article].created_at, 'YYYY-MM-DD').fromNow()}
                        </span>
                      </p>
                      <p className="text-grey">{this.props.articles[article].users.email}</p>
                    </div>
                  </div>
                  <div
                    className="panel-body"
                    style={{
                      maxHeight: '250px',
                      overflow: 'hidden'
                    }}
                  >
                    <h3>
                      <Link to={`/article/${this.props.articles[article].slug}`} className="article-title">
                        {this.props.articles[article].title}
                      </Link>
                    </h3>
                    <div dangerouslySetInnerHTML={{ __html: this.showReadMore(this.props.articles[article].posts) }} />
                  </div>
                  <div
                    className="panel-footer row"
                    style={{ marginLeft: '0px', marginRight: '0px' }}
                  >
                    <div className="col-sm-4" style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                      <div
                        className="col-sm-6"
                        style={{
                          paddingLeft: '0px',
                          paddingRight: '0px',
                          marginRight: '5px',
                          width: '22px',
                        }}
                      >
                        <img
                          src="/icons/heart/svg/favorite.svg"
                          height="20"
                          width="20"
                          alt="heart"
                          onClick={this.onLikeClick}
                        />
                      </div>
                      <div
                        className="col-sm-6"
                        style={{
                          padding: '0px',
                          width: '30px'
                        }}
                      >
                        10
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  showReadMore(string, limit = 250) {
    const shouldTrim = string.replace(/<[^>]*>/g, '').length > limit;

    if (shouldTrim) {
      let trimmedString = string.replace(/<[^>]*>/g, '').substr(0, limit);
      trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));

      return `${trimmedString} ... <a href="#">Read More</>`;
    }

    return string;
  }
}

const mapStateToProps = (state) => ({
  messages: state.messages,
  articles: state.articles,
});

export default connect(mapStateToProps)(Home);

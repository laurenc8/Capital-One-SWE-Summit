import React from 'react';
import './App.css';

const REQUEST = {
    NOT_SENT: "NOT_SENT",
    SENT: "SENT",
    SUCCESS: "SUCCESS",
    FAILED: "FAILED"
};


function Item(props) {
    return <p>{props.title}</p>
}

function Articles(props) {
    if (props.status === "ok") {
        if (props.articles.length === 0) {
            <p>no articles</p>
        } else {
            return <div>
          {props.articles.map(item => (<Item {...item} />))}
          </div>
        }
    } else {
        return <p>Error: {props.message}</p>
    }
}

function Status(props) {
          return <div>{
            (props.status === REQUEST.NOT_SENT) ?
              <p>Not sent</p>
          : (props.status === REQUEST.SENT) ?
              <p>loading</p>
          : (props.status === REQUEST.FAILED) ?
              <p>failed</p>
          : (props.status === REQUEST.SUCCESS) ?
              <p>success</p>
          : <p>Error</p>
          }</div>
}

function Inputs(props) {
    return <input type="text" value={props.q} onChange={e => props.handleparams({q: e.target.value})} />
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
    params: {
        q:"foo",
    },
    request: REQUEST.NOT_SENT,
    response: {
    "status": "ok",
    "totalResults": 38,
    "articles": [
        {
            "source": {
                "id": null,
                "name": "New York Times"
            },
            "author": "Michael Crowley",
            "title": "Trump’s False Election Fraud Claims Split Republicans - The New York Times",
            "description": "Die-hard loyalists declared total support for President Trump while others issued generalized statements about vote counting or condemned him outright.",
            "url": "https://www.nytimes.com/2020/11/06/us/politics/trump-election-republicans.html",
            "urlToImage": "https://static01.nyt.com/images/2020/11/06/us/politics/06dc-trump-gop/06dc-trump-gop-facebookJumbo.jpg",
            "publishedAt": "2020-11-06T22:19:00Z",
            "content": "Republicans are facing a character test, Mr. Bolton wrote on Twitter. All candidates are entitled to pursue appropriate election-law remedies if they have evidence supporting their claims. They shoul… [+1675 chars]"
        },
    ]
}
};
    }


    getnews() {
        const url = "http://newsapi.org/v2/top-headlines?"
        const params = Object.entries(this.state.params).map(kv => `${kv[0]}=${escape(kv[1])}`).join("&");
        this.setState({...this.state, request: REQUEST.SENT});
        fetch(url+params).then(response => {
            this.setState({...this.state, request: REQUEST.SUCCESS, response});
        }).catch(err => {
            this.setState({...this.state, request: REQUEST.FAILED})
        });
    }

    render() {
        const handleparams = p => {
            this.setState({...this.state, params: {...this.state.params, ...p}})};
      return (
        <div className="App">
          <header className="App-header">
          <Inputs {...{...this.state.params, handleparams }} />
          </header>
          <Status status={this.state.request} />
          <Articles {...this.state.response} />
        </div>
      );
    }
}

export default App;

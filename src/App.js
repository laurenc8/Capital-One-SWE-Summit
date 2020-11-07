import React from 'react';
import './App.css';

const REQUEST = {
    SENT: "SENT",
    SUCCESS: "SUCCESS",
    FAILED: "FAILED"
};


function Item(props) {
    const date = new Date(props.publishedAt);
    return <a href={props.url} target="_blank" rel="noreferrer" class="item">
            <img src={props.urlToImage} alt="article background" class="bgimage" />
            <p class="headline">{props.title}</p>
            <p class="description">{props.description}</p>
            <p class="info">Published {date.toLocaleDateString()} {date.toLocaleTimeString()}. From {props.source.name}, by {props.author} </p>
        </a>
}

function Articles(props) {
    if (props.status === "ok") {
        if (props.articles.length === 0) {
            return <p>no articles</p>
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
          return <div class="info" >{
          (props.status === REQUEST.SENT) ?
              <p>loading</p>
          : (props.status === REQUEST.FAILED) ?
              <p>failed</p>
          : (props.status === REQUEST.SUCCESS) ?
              <p>success</p>
          : <p>Error</p>
          }</div>
}

function Inputs(props) {
    const params = props.params;
    const categories = {
        entertainment: "Entertainment",
        sports: "Sports",
        technology: "Technology"
    };
    return <div>
        <form onSubmit={props.handlesubmit} >
        <span class="title-sub" >News.</span><br/>
        <input class="title" type="text" placeholder="Everything." value={params.q} 
            onChange={e => props.handleparams({q: e.target.value})} />
        <select class="title" onChange={e => props.handleparams({category: e.target.value})} >
        {Object.entries(categories).map(kv => <option selected={kv[0]===params.cateogory} value={kv[0]}>{kv[1]}</option>)}
        </select><br/>
        <input class="title-sub" style={{float: "right"}} type="submit" value="Gimme" />
        </form>
    </div>
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
    params: {
        country: "us",
        q:"",
        category:"entertainment",
        apiKey: "5b34f7dccfc3428d8a0884cab18d3529", // I know; would not do if I was actually paying for this
    },
    request: REQUEST.SENT,
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

    componentDidMount() {
        this.getnews();
    }


    getnews() {
        const url = "http://newsapi.org/v2/top-headlines?"
        const params = Object.entries(this.state.params).filter(
            kv => escape(kv[1]) !== "").map(
            kv => `${kv[0]}=${escape(kv[1])}`).join("&");
        this.setState({...this.state, request: REQUEST.SENT});
        fetch(url+params).then(response => {return response.json()}).then(json => {
            console.log(json);
            this.setState({...this.state, request: REQUEST.SUCCESS, response: json});
        }).catch(err => {
            this.setState({...this.state, request: REQUEST.FAILED})
        });
    }

    render() {
        const handleparams = p => {
            this.setState({...this.state, params: {...this.state.params, ...p}})};
      return (
        <div className="App">
          <header className="header">
          <Inputs params={this.state.params} handleparams={handleparams} handlesubmit={e => {e.preventDefault(); this.getnews()} } />
          </header>
          <Status status={this.state.request} />
          <Articles {...this.state.response} />
        </div>
      );
    }
}

export default App;

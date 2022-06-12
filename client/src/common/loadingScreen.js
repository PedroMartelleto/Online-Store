import React from "react"
import "./lds-ellipsis.scss"

class LoadingScreen extends React.Component {
    render() {
        return (
            <div className="App-container">
                <div className="lds-ellipsis">
                    <div />
                    <div />
                    <div />
                    <div />
                </div>
            </div>
        )
    }
}

export default LoadingScreen
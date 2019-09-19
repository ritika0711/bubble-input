import React from 'react';
import './index.css'
import cross from './../crossbutton.svg'

export default class BubbleInput extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            items : [],
            dataStore : [
                "Ritika@gmail.com",
                "Fatima@gmail.com",
                "shreya@gmaik.com",
                "shrey@gmail.com"
            ],
            suggestion : [],
            suggestionBox : false
        }
    }

    onChange(e){
        // console.log("ritila",e.which)
        // if(e.which === 91) return null
        let el = e.target;
        let keyCode = e.key === ' ' || e.key === 'Spacebar' ? 32 : e.key === "Backspace" ? 8 : null;
        let textNode = this.getTextNode(el);
        let items = Object.assign([], this.state.items);
        let selection = window.getSelection().toString();

        // get suggestion
        if(textNode !== null){
            this.setState({
                suggestion : this.getSuggestion(textNode.textContent),
            });
        }

        // if selected
        if(keyCode === 8 && selection.length === 0){
            e.preventDefault();
            window.getSelection().empty();
            this.setCaretAtEnd(el);
            return;
        }

        if(e.key === "Meta" && textNode !== null && keyCode !== null){
            let value = textNode.textContent.split(",")
            let trimmedValue = [];
            value.map((v, k) => {
                trimmedValue.push({
                    value : v.trim()
                })
            })

            let newItem = [...items, ...trimmedValue];
            
            this.setState({
                items : newItem
            }, () => {
                this.removeTextContent(el);
                this.createNewTextNode(el);
                this.setCaretAtEnd(el);

                if(this.props.onChange)
                    this.props.onChange(this.state.items)
            })
        }
        else if(textNode === null && items.length - 1 >= 0 && keyCode === 8 && selection.length === 0){
            e.preventDefault();
            let k = items.length - 1;
            this.removeItem(k);
        }
        else if(textNode !== null && keyCode === 32){
            let value = textNode.textContent.replace(",", "").trim()
            
            if(value.length === 0 || !this.isValidateEmail(value)) return;

            let obj = {
                value : value
            }

            items.push(obj);
            var newItems = Object.assign([], items);
            this.setState({
                items : newItems
            }, () => {
                this.removeTextContent(el);
                this.createNewTextNode(el);
                this.setCaretAtEnd(el);

                if(this.props.onChange)
                    this.props.onChange(this.state.items)
            })
        }
    }

    isValidateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // get plain text
    getTextNode(el){
        let nodes = el.childNodes;
        var textNode = null;
        Object.keys(nodes).map((k) => {
            if(nodes[k] && nodes[k].nodeType === Node.TEXT_NODE)
                textNode = nodes[k];
        })

        return textNode;
    }

    // remove plain text
    removeTextContent(el){
        let nodes = el.childNodes;
        Object.keys(nodes).map((k) => {
            if(nodes[k] && nodes[k].nodeType === Node.TEXT_NODE){
                nodes[k].remove()
            }
        })
    }

    // create new text node
    createNewTextNode(el){
        var newTextNode = document.createTextNode(",");
        el.appendChild(newTextNode);
    }

    // set caret at the end
    setCaretAtEnd(el){
        if(el === null) return;

        el.focus();
        if(typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();

            sel.addRange(range);
        } else if(typeof document.body.createTextRange !== "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    }

    // remove item
    removeItem(k){
        let items = Object.assign([], this.state.items);
        items.splice(k, 1);
        let newItems = Object.assign([], items);

        this.setState({
            items : newItems
        }, () => {
            if(this.props.onChange)
                this.props.onChange(this.state.items)
        })
    }

    reset(){
        this.setState({
            items : []
        }, () => {
            let el = this.refs['bubble_input']
            this.removeTextContent(el);
        })
    }

    getSuggestion(q){
        let suggestion = [];
        q = q.indexOf(",") !== -1 ? q.replace(",","") : q;

        this.state.dataStore.map((v, k) => {
            if(v.toLowerCase().indexOf(q) !== -1 && !this.isInItem(v)){
                suggestion.push(v)
            }
        })

        return suggestion;
    }

    isInItem(val){
        let exists = false;
        this.state.items.map((v, k) => {
            if(v.value === val)
                exists = true
        })

        return exists;
    }

    clickSuggestion(val){
        const el = this.refs["bubble_input"];
        let items = Object.assign([], this.state.items);
        items.push({
            value : val
        });
        let newItems = Object.assign([], items);

        this.setState({
            items : newItems
        }, () => {
            this.removeTextContent(el);
            this.createNewTextNode(el);
            this.setCaretAtEnd(el);

            if(this.props.onChange)
                this.props.onChange(this.state.items)
        })
    }

    render(){
        let style = {
            // width : "500px",
            height : "50px",
            backgroundColor : "lightgray",
            borderBottom : "1px solid black",
            ...this.props.style
        }

        let itemStyle = {
            padding : "5px 10px 5px 10px",
            borderStyle : "solid",
            borderWidth : "1px",
            borderColor : "gray",
            borderRadius : "20px 20px 20px 20px",
            marginLeft : "2px",
            
            marginRight : "2px",
            boxSizing : "border-box",
            margin : "4px",
            backgroundColor : "#f1f1f1",
            marginTop : "10px",
            // color : "#868688"
        }

        let removeButtonStyle = {
            paddingLeft : "10px",
            userSelect : "none",
            cursor : "pointer"
        }

        return(
            <React.Fragment>
                <div className = "bubble-container">
                    <div 
                        style = {style}
                        ref = "bubble_input"
                        onKeyUp = {this.onChange.bind(this)}
                        contentEditable = {true}>
                        {/* <div className = "bubble-wrap"> */}
                        {
                            this.state.items.map((item, k) => {
                                return <span 
                                            className = "bubble-wrap"
                                            contentEditable = {false}
                                            bubble-input-id = {"bubble_input_"+k}
                                            style = {itemStyle}
                                            >
                                                {item.value}
                                                <span 
                                                    style = {removeButtonStyle}
                                                    onClick = {this.removeItem.bind(this, k)}><img src = {cross} alt = "" height = "12px"/>
                                                </span>
                                        </span>
                            })
                        }
                        {/* </div> */}
                        
                    </div>
                    <div className = "selection-dropdown">
                        {
                            this.state.suggestion.map((v,k) => {
                                return(
                                    <div className = "suggestion--container" onClick = {this.clickSuggestion.bind(this, v)}>
                                        <div style = {{height : "30px",width : "30px",borderRadius : "100%",background : "gray"}}></div>
                                        <div className = "listed-email">{v}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
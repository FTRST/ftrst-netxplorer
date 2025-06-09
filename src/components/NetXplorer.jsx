import {React, useState, useEffect, useRef, useMemo} from 'react'
import { css } from 'styled-components';
import {
    BaseWindow,
    Input,
    Button,
    WindowInner,
} from 'futurist-components';

const SearchBar = ({clearSite, currentURL, backNavigate}) => {
    return (
        <>
            <div style={{width: "100%", margin: "auto", display: "flex"}}>
                <Button label="⌂" action={clearSite}/>
                <Input value={currentURL} style={css`width: 100%;`}/>
                <Button label="←" action={backNavigate}/>
            </div>
        </>
    )
}

const NetBody = ({htmlContent, updateUrl, htmlRef}) => {
    return (
        <>
        {
            htmlContent ? (
            <>
                <div ref={htmlRef} dangerouslySetInnerHTML={{__html: htmlContent}} />  
            </>
            ):
            <>
                <Button action={updateUrl} dataUrl="https://geocities.restorativland.org/" label="GeoCities"></Button>
            </>
        }
        </>
    )
};

function NetXplorer({ device, manipulateWindows }) {
    const windowDetails = device.windows.find(w => w.id === "nxp");
    const [currentURL, setCurrentURL] = useState(null);
    const [siteHistory, setSiteHistory] = useState([]);
    const [htmlContent, setHtmlContent] = useState(null);
    const htmlRef = useRef(null);

    useEffect(() => {
        if (currentURL) {
                fetch(`https://futurist.io/fetch?url=${currentURL}`, {
                method: 'GET'
            })
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const fetchedBody = doc.body;
                console.log(fetchedBody);
                const background = fetchedBody.getAttribute('background');
                if (background) {
                    const containerDiv = document.createElement('div');
                    containerDiv.style.backgroundImage = `url(${background})`;

                    containerDiv.innerHTML = fetchedBody.innerHTML;
                    console.log(containerDiv.outerHTML);
                    setHtmlContent(containerDiv.outerHTML);
                } else {
                    setHtmlContent(fetchedBody.innerHTML);
                }
            })
            .catch(error => {
                console.error("Bad error fetching", error);
            });
        }
    }, [currentURL]);

    useEffect(() => {
        if (htmlContent && htmlRef) {
            const handleClick = (event) => {
                if (event.target.tagName === 'A' || event.target.tagName === 'BUTTON') {
                    event.preventDefault();
                    const href = event.target.getAttribute('href');
                    setCurrentURL(href);
                }
            };
    
            const container = htmlRef.current;
            container.addEventListener('click', handleClick);
    
            return () => {
                container.removeEventListener('click', handleClick);
            };
        }
    }, [htmlContent]);

    function clearSite() {
        setCurrentURL(null);
    }
    
    function backNavigate() {
        if (siteHistory.length > 1) {
            // get last added item
        } else if (siteHistory.length == 1) {
            setCurrentURL(null);
        } else {
            
        }
    }
    /*
    function updateUrl(value) {
        setCurrentURL("https://geocities.restorativland.org/")
        console.log(currentURL);
        console.log(url);
    }
    */

    const updateUrl = (e) => {
        console.log(currentURL)
        console.log(e);
        let url = e.target.dataset.url;
        setCurrentURL(url);
        console.log(currentURL);
    }

    return (
        <>
            {
                windowDetails && 
                <>
                    <BaseWindow key="1" id="nxp" device={device} manipulateWindows={manipulateWindows} style={css`width: 100%;`}>
                    <SearchBar currentURL={currentURL} />
                        <WindowInner>
                            <NetBody htmlContent={htmlContent} updateUrl={updateUrl} htmlRef={htmlRef} />
                        </WindowInner>
                    </BaseWindow>
                </>
            }
        </>
    )
}

export default NetXplorer

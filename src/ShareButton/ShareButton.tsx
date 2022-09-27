/** @jsx jsx */
import { jsx } from "@emotion/react";
import { FC } from "react";
import { EmailIcon } from "./EmailIcon";
import { FacebookIcon } from "./FacebookIcon";
import { RedditIcon } from "./RedditIcon";
import { TwitterIcon } from "./TwitterIcon";
import { useWindowSize } from "../Components/Window/WindowSizeProvider";
import { IconType } from "../Utils/createIcon";

const GAME_URL = "https://www.futurebutcher.com";
const DEFAULT_TEXT = "Check out this awesome game";
const HASHTAG = "futurebutcher";
const WINDOW_TITLE = "Share Future Butcher";

interface ShareButtonProps {
    platform: "fb" | "twitter" | "reddit" | "email";
    shareText?: string;
}

export function ShareButton({ platform, shareText }: ShareButtonProps) {
    const { windowSize } = useWindowSize();

    const handleClick = () => {
        const windowFeatures = `left=100,top=100,width=${windowSize.inlineSize},height=${windowSize.blockSize}`;
        switch (platform) {
            case "fb":
                window.open(getFBUrl(), WINDOW_TITLE, windowFeatures);
                break;
            case "twitter":
                window.open(
                    getTwitterUrl(shareText),
                    WINDOW_TITLE,
                    windowFeatures,
                );
                break;
            case "reddit":
                window.open(
                    getRedditUrl(shareText),
                    WINDOW_TITLE,
                    windowFeatures,
                );
                break;
            case "email":
                if (navigator.userAgent.match(/iPhone|iPad/)) {
                    window.open(getMessageUrl(shareText), "_blank");
                } else if (navigator.userAgent.match(/Android/)) {
                    window.open(getSMSUrl(shareText), "_blank");
                } else {
                    window.open(getEmailUrl(shareText), "_blank");
                }
                break;
            default:
                return;
        }
    };

    let Icon: FC<IconType> | null = null;
    switch (platform) {
        case "fb":
            Icon = FacebookIcon;
            break;
        case "twitter":
            Icon = TwitterIcon;
            break;
        case "reddit":
            Icon = RedditIcon;
            break;
        case "email":
            Icon = EmailIcon;
            break;
        default:
            break;
    }

    return (
        <button
            css={{
                backgroundColor: "transparent",
                border: 0,
                marginInline: "5px",
                padding: 0,
            }}
            onClick={handleClick}
        >
            {Icon !== null && <Icon round={true} size={45} />}
        </button>
    );
}

const FB_URL = "https://www.facebook.com/sharer/sharer.php";
function getFBUrl() {
    const gameUrl = encodeURIComponent(GAME_URL);
    const quote = encodeURIComponent(DEFAULT_TEXT);
    const hashTag = encodeURIComponent(`#${HASHTAG}`);
    return `${FB_URL}?display=popup&u=${gameUrl}&hashtag=${hashTag}&quote=${quote}`;
}

const TWITTER_URL = "https://twitter.com/intent/tweet";
function getTwitterUrl(text?: string) {
    const message = text
        ? encodeURIComponent(text)
        : encodeURIComponent(DEFAULT_TEXT);
    const gameUrl = encodeURIComponent(GAME_URL);
    const hashTag = encodeURIComponent(HASHTAG);
    return `${TWITTER_URL}?text=${message}&url=${gameUrl}&hashtags=${hashTag}`;
}

const REDDIT_URL = "https://www.reddit.com/submit";
function getRedditUrl(text?: string) {
    const title = text
        ? encodeURIComponent(text)
        : encodeURIComponent(DEFAULT_TEXT);
    return `${REDDIT_URL}?url=${GAME_URL}&title=${title}`;
}

function getMessageUrl(text?: string) {
    const message = text
        ? encodeURIComponent(text)
        : encodeURIComponent(DEFAULT_TEXT);
    return `sms:&body=${message} ${GAME_URL}`;
}

function getSMSUrl(text?: string) {
    const message = text
        ? encodeURIComponent(text)
        : encodeURIComponent(DEFAULT_TEXT);
    return `sms:?body=${message} ${GAME_URL}`;
}

function getEmailUrl(text?: string) {
    const message = text
        ? encodeURIComponent(`${text} ${GAME_URL}`)
        : encodeURIComponent(GAME_URL);
    return `mailto:?subject=${DEFAULT_TEXT}&body=${message}`;
}

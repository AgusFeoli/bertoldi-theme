import { useEffect, useState } from 'react'
import style from './index.css'

const VideoBanner = (props) => {

    const {
        __editorItemTitle,
        vidDes,
        vidMob,
        imgDes,
        imgMob
    } = props

    const [viewMobile, setViewMobile] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setViewMobile(window.innerWidth <= 640);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (vidDes || vidMob || imgDes || imgMob) {
            setLoading(false);
        }
    }, [vidDes, vidMob, imgDes, imgMob]);

    if (loading) return <></>;

    // ✅ Detecta plataforma y extrae ID
    const parseVideoSource = (url) => {
        if (!url) return null;

        // Vimeo
        if (url.includes("vimeo.com")) {
            return {
                type: "vimeo",
                id: url.split("/").pop()
            };
        }

        // YouTube normal
        if (url.includes("youtube.com/watch")) {
            const id = new URL(url).searchParams.get("v");
            return { type: "youtube", id };
        }

        // YouTube share link
        if (url.includes("youtu.be/")) {
            return {
                type: "youtube",
                id: url.split("youtu.be/")[1]
            };
        }

        return null;
    };

    const videoDesktop = parseVideoSource(vidDes);
    const videoMobile = parseVideoSource(vidMob);

    const videoToUse = viewMobile ? videoMobile : videoDesktop;

    return (
        <div className={style.media_block}>
            <div className={style.media_container}>

                <div className={style.media_item}>

                    {/* ✅ Renderiza SIEMPRE video si existe */}
                    {videoToUse ? (
                        <>
                            {videoToUse.type === "vimeo" && (
                                <>
                                    <iframe
                                        src={`https://player.vimeo.com/video/${videoToUse.id}?title=0&byline=0&sidedock=0&controls=0&badge=0&muted=1&loop=1&autoplay=1&background=1`}
                                        frameBorder="0"
                                        allow="autoplay; encrypted-media"
                                        className={style.media_video}
                                        title={__editorItemTitle}
                                    ></iframe>
                                    <script src="https://player.vimeo.com/api/player.js"></script>
                                </>
                            )}

                            {videoToUse.type === "youtube" && (
                                <iframe
                                    src={`https://www.youtube.com/embed/${videoToUse.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoToUse.id}&modestbranding=1&showinfo=0`}
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media"
                                    className={style.media_video}
                                    title={__editorItemTitle}
                                ></iframe>
                            )}
                        </>
                    ) : (
                        // ✅ fallback imagen
                        <img
                            src={viewMobile ? imgMob : imgDes}
                            alt={__editorItemTitle}
                            className={style.media_banner}
                        />
                    )}
                </div>

            </div>
        </div>
    );
};

VideoBanner.schema = {
    title: "Archivos Multimedia",
    description: "Video banner",
    type: "object",
    properties: {
        vidDes: {
            title: "Video Desktop (Vimeo o YouTube)",
            description: "Para pantallas grandes.",
            type: "string"
        },
        vidMob: {
            title: "Video Mobile (Vimeo o YouTube)",
            description: "Para pantallas pequeñas.",
            type: "string"
        },
        imgDes: {
            title: "Imagen de respaldo Desktop",
            description: "Para pantallas grandes.",
            type: "string",
            widget: { "ui:widget": "image-uploader" }
        },
        imgMob: {
            title: "Imagen de respaldo Mobile",
            description: "Para pantallas pequeñas.",
            type: "string",
            widget: { "ui:widget": "image-uploader" }
        }
    }
};

export default VideoBanner;

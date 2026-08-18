import "./Avatar.css";

function Avatar({
    name = "Vishal Prajapati",
    size = "medium",
    image = "",
}) {

    return (

        <div className={`avatar avatar-${size}`}>

            {image ? (
                <img
                    src={image}
                    alt={name}
                />
            ) : (
                <span>
                    {name
                        .split(" ")
                        .map(word => word[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                </span>
            )}

        </div>

    );

}

export default Avatar;
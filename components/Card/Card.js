import Image from "next/image";
import React, { useState } from "react";
import styles from "./Card.module.css";

import { motion } from "framer-motion";
import cls from "classnames";

const Card = (props) => {
	const {
		id,
		imgUrl = "/static/missing_image.jpg",
		size = "medium",
		shouldScale = true,
	} = props;

	const [imgSrc, setImgSrc] = useState(imgUrl);

	const classMap = {
		large: styles.lgItem,
		medium: styles.mdItem,
		small: styles.smItem,
	};

	const handleOnError = () => {
		setImgSrc("/static/missing_image.jpg");
	};

	const scale =
		id === 0
			? { scaleY: 1.1 }
			: {
					scale: 1.1,
			  };
	const shouldHover = shouldScale && {
		whileHover: { ...scale },
	};

	console.log({ shouldHover });

	return (
		<div className={styles.container}>
			<motion.div
				{...shouldHover}
				className={cls(classMap[size], styles.imgMotionWrapper)}
			>
				<Image
					src={imgSrc}
					alt="image"
					layout="fill"
					onError={handleOnError}
					className={styles.cardImg}
				></Image>
			</motion.div>
		</div>
	);
};

export default Card;

import clsx from 'clsx';
import { ImgHTMLAttributes, SVGAttributes } from 'react';

export default function ApplicationLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img {...props} className={clsx('', props.className)} />
    );
}

import React from 'react';
import { Persona, PersonaSize } from '@fluentui/react';

// Uses a standard FluentUI Persona component to render an avatar.
// See: https://developer.microsoft.com/en-us/fluentui#/controls/web/persona
//
// If name and no base64, will render initials.
// If no name and no base64, will render person icon.

interface AvatarProps {
    name?: string;
    base64?: string;
    size?: PersonaSize;
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, base64, size = AvatarSizes.medium, className = '' }) => {
    const src = base64 ? `data:image/png;base64,${base64}` : null;
    return (
        <Persona
            className={className}
            text={name}
            hidePersonaDetails
            size={size}
            imageUrl={src}
            imageAlt={name}
            data-testid="avatar"
        />
    );
};

export default Avatar;

export const AvatarSizes = {
    small: PersonaSize.size32,
    medium: PersonaSize.size48,
    large: PersonaSize.size72,
    xLarge: PersonaSize.size100,
    xxLarge: PersonaSize.size120,
};

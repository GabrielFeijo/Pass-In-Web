import { ComponentPropsWithoutRef } from 'react';

interface NavLinkProps extends ComponentPropsWithoutRef<'a'> {}

export function NavLink({ ...props }: NavLinkProps) {
	return <a {...props} />;
}

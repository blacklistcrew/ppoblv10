import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { PageProps, UserType } from '@/types';
import Card from '@/Components/Card';

export default function Edit({ data, user }: PageProps & { user: UserType }) {
    return (
        <AuthenticatedLayout
            data={data}
            title="Profile"
        >
            <Card className="p-4 sm:p-8">
                <UpdateProfileInformationForm className="max-w-xl" user={user} />
            </Card>

            <Card className="p-4 sm:p-8">
                <UpdatePasswordForm className="max-w-xl" user={user} />
            </Card>
        </AuthenticatedLayout>
    );
}

export const getLogger: (tag: string) => (args: any) => void =
    tag => args => console.log(tag, args);

export const formatDate = (date: string) => {
    const dateObject = new Date(date);
    let day = dateObject.getDate() + 1;
    let month = dateObject.getMonth() + 1;
    let year = dateObject.getFullYear();
    return day + "-" + month + "-" + year;
}
export const getLogger: (tag: string) => (args: any) => void =
    tag => args => console.log(tag, args);

export const formatDate = (date: string) => {
    let formattedDate = new Date(date);
    let day = formattedDate.getDate();
    let month = formattedDate.getMonth() + 1;
    let year = formattedDate.getFullYear();
    return day + "-" + month + "-" + year;
}
export const fakeOutbox = [];

export const fakeMailer = {
    async sendMail(message) {
        const fakeMessage = { ...message, sentAt: new Date().toISOString() };
        fakeOutbox.push(fakeMessage);
        console.info("[fake mail]", JSON.stringify(fakeMessage, null, 2));
        return { messageId: `fake-${fakeOutbox.length}` };
    }
};